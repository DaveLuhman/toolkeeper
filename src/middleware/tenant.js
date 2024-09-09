import { Tenant } from "../models/index.models.js";
import { User } from "../models/index.models.js";
import { sendEmail, getDomainFromEmail } from "../controllers/util.js";
import { demoTenantId } from "../config/db.js";

// Utility function to generate a random password
const generatePassword = () => {
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
		const { firstName, lastName, tenantName, adminEmail } = req.body;
		const domain = getDomainFromEmail(adminEmail);
		// Check if the admin user already exists
		let adminUser = null
		adminUser = await User.findOne({ email: adminEmail });
		const password = generatePassword();

		if (!adminUser) {

			adminUser = await User.create({
				firstName: firstName || 'Admin',
				lastName: lastName || 'User',
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

		// Split tenants into active and inactive groups
		const activeTenants = tenants.filter(
			(tenant) => tenant.subscriptionActive === true,
		);
		const inactiveTenants = tenants.filter(
			(tenant) => tenant.subscriptionActive === false,
		);

		// Hoist active and inactive tenants to res.locals
		res.locals.activeTenants = activeTenants;
		res.locals.inactiveTenants = inactiveTenants;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// Handle any errors that occur during the database query
		res
			.status(500)
			.render("error", { message: "Failed to load tenants", error });
	}
};
