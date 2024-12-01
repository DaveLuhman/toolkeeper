import { Tenant } from "../models/index.models.js";
import { User } from "../models/index.models.js";
import { sendEmail, getDomainFromEmail } from "../controllers/util.js";
import { demoTenantId } from "../config/db.js";

// Utility function to generate a random password
export const generatePassword = () => {
	const tools = [
		"Hammer",
		"Screwdriver",
		"Wrench",
		"Pliers",
		"Drill",
		"Saw",
		"Chisel",
		"Mallet",
		"Level",
		"Tape_measure",
		"Utility_knife",
		"File",
		"Vice",
		"Clamp",
		"Sledgehammer",
		"Hacksaw",
		"Allen_wrench",
		"Pipe_wrench",
		"Crescent_wrench",
		"Socket_wrench",
		"Torque_wrench",
		"Needle_nose_pliers",
		"Slip_joint_pliers",
		"Bolt_cutters",
		"Staple_gun",
		"Heat_gun",
		"Crowbar",
		"Trowel",
		"Caulking_gun",
		"Handsaw",
		"Wire_strippers",
		"Multimeter",
		"Ruler",
		"Sanding_block",
		"Square",
		"Adjustable_wrench",
		"Air_compressor",
		"Hand_plane",
		"Needle_file",
		"Cold_chisel",
		"Phillips_screwdriver",
		"Flathead_screwdriver",
		"Power_drill",
		"Rotary_tool",
		"Jigsaw",
		"Circular_saw",
		"Table_saw",
		"Router",
		"Angle_grinder",
		"Soldering_iron",
		"Power_sander",
		"Stud_finder",
		"Laser_level",
		"Shop_vacuum",
		"Ladder",
		"Extension_cord",
		"Paintbrush",
		"Putty_knife",
		"Spanner",
		"Nut_driver",
		"Breaker_bar",
		"Impact_driver",
		"Pry_bar",
		"Framing_hammer",
		"Ratcheting_wrench",
		"Wood_clamp",
		"Grease_gun",
		"Pipe_cutter",
		"Plumb_bob",
		"Bolt_extractor",
		"Jack",
		"Anvil",
		"Sharpening_stone",
		"Paint_roller",
		"Hot_glue_gun",
		"Measuring_tape",
		"Chainsaw",
		"Reciprocating_saw",
		"Nail_gun",
		"Tile_cutter",
		"Pinch_pliers",
		"Pipe_threader",
		"Bench_grinder",
		"Nibbler",
		"Angle_clamp",
		"Drill_press",
		"Metal_snips",
		"Tap_and_die_set",
		"Fish_tape",
		"Pneumatic_drill",
		"Hose_clamp",
		"Sledge",
		"Post_hole_digger",
		"Planer",
		"Cutting_torch",
		"Deburring_tool",
		"Crowfoot_wrench",
		"Hex_key",
		"Slip_joint_wrench",
		"Torpedo_level",
	];
	const randomTool = tools[Math.floor(Math.random() * tools.length)];
	const randomNumbers = Math.floor(100 + Math.random() * 900).toString(); // 3 random digits
	return `${randomTool}${randomNumbers}`;
};

export const createTenant = async (req, res, next) => {
	try {
		const { name, tenantName, adminEmail } = req.body;
		const domain = getDomainFromEmail(adminEmail);
		// Check if the admin user already exists
		let adminUser = null;
		adminUser = await User.findOne({ email: adminEmail });
		const password = generatePassword();

		if (!adminUser) {
			adminUser = await User.create({
				name: name || "Admin User",
				email: req.body.adminEmail,
				password: password, // The setter in the User model will hash this
				role: "Admin",
				tenant: demoTenantId, // Assign the default demo tenant here
			});

			await adminUser.save();
		}
		const tenant = await Tenant.createWithDefaults({
			name: tenantName,
			domain,
			adminUser: adminUser._id,
		});
		// Update the adminUser document with the Tenant reference
		adminUser.tenant = tenant._id;
		await adminUser.save();

		// Send an email to the new admin user with their credentials
		const subject = "Your ToolKeeper Admin Account";
		const text = `Your admin account for ToolKeeper has been created. Your login credentials are:\n\nEmail: ${adminEmail}\nPassword: ${password}\n\nPlease log in and change your password as soon as possible.`;

		await sendEmail(adminEmail, subject, text);
		next();
	} catch (error) {
		res.status(400).render("error/error", { message: error.message });
	}
};

/**
 * Middleware to fetch all tenants, split them into active and inactive, and hoist them to res.locals.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const getTenants = async (req, res, next) => {
	try {
		// Fetch all tenants from the database
		const tenants = await Tenant.find();
		const activeTenants = []
		const inactiveTenants = []

		// Split tenants into active and inactive groups
		for(const tenant of tenants){
			tenant.subscription?.status === "active" ? activeTenants.push(tenant) : inactiveTenants.push(tenant)
		}

		// Hoist active and inactive tenants to res.locals
		res.locals.activeTenants = activeTenants;
		res.locals.inactiveTenants = inactiveTenants;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// Handle any errors that occur during the database query
		res
			.status(500)
			.render("error/error", { message: "Failed to load tenants", error });
	}
};

/**
 * Middleware to impersonate a tenant for superadmins
 */
export const impersonateTenant = async (req, res, next) => {
	try {
		const { tenantId } = req.params; // Assuming tenantId is passed as a URL parameter

		// Check if the logged-in user is a superadmin
		if (req.user.role !== "Superadmin") {
			// Render an error page with 401 status for unauthorized access
			return res.status(401).render("error/error", {
				message: "You do not have permission to impersonate tenants.",
				status: 401,
			});
		}

		// If tenantId is "original", revert to the superadmin's original tenant then render the dashboard via the route terminator
		if (tenantId === "original") {
			req.user.tenant = req.session.originalTenant;
			req.session.originalTenant = undefined; // Clear the stored original tenant
			req.session.impersonatedTenant = undefined; // clear the stored impersonation target
			return next();
		}

		// Find the tenant by ID
		const targetTenant = await Tenant.findById(tenantId).lean();
		if (!targetTenant) {
			// Render an error page if the tenant is not found
			return res.status(404).render("error/error", {
				message: "Tenant not found.",
				status: 404,
			});
		}

		// Store the original tenant in the session (if not already stored)
		if (!req.session.originalTenant) {
			req.session.originalTenant = req.user.tenant;
		}

		// Change the tenant for the current session
		req.session.impersonatedTenant = targetTenant._id;


		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		console.error("Error impersonating tenant:", error);
		res.status(500).render("error/error", {
			message: "An error occurred while impersonating the tenant.",
			status: 500,
		});
	}
};

export const applyImpersonation = async (req, res, next) => {
	// Check if the session has an impersonated tenant
	if (req.session.impersonatedTenant) {
		// apply impersonation
	  req.user.tenant = req.session.impersonatedTenant;
	  // hoist tenant object for impersonation banner to identify the target tenant
	  res.locals.tenant = await Tenant.findById(req.session.impersonatedTenant).lean();
	}
	next();
  };
// src\middleware\tenant.js
