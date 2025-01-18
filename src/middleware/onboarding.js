import { Onboarding } from "../models/index.models.js";

export const hoistOnboarding = async (req, res, next) => {
	try {
		// Fetch user's onboarding document
		let onboardingDoc = await Onboarding.findOne({ user: req.user._id });

		// If no onboarding document exists, create one
		if (!onboardingDoc) {
			onboardingDoc = await Onboarding.create({
				user: req.user._id,
				tenant: req.user.tenant
			});
			console.log(`Created missing onboarding document for user ${req.user._id}`);
		}
		
		res.locals.onboarding = onboardingDoc;
		console.log("Onboarding Hoisted");
		next();
	} catch (error) {
		console.error("Error in hoistOnboarding:", error);
		next(new Error("Failed to locate or create onboarding document"));
	}
};
export const skipStep = async (req, res, next) => {
	const { step } = req.params;
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress[step] = true;
	await onboarding.save();
	res.locals.onboarding = onboarding;
	next();
};

export const dashboardOnboardingComplete = async (req, res) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.dashboardCompleted = true;

	await onboarding.save();
	res.locals.onboarding = onboarding;
	res.sendStatus(200);
};

export const profileOnboardingComplete = async (req, res) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.profileSetup = true;
	await onboarding.save();
	res.sendStatus(200);
};

export const usersOnboardingComplete = async (req, res, next) => {
	try {
		const onboarding = await Onboarding.findOne({ user: req.user.id });
		onboarding.progress.usersSetup = true;
		await onboarding.save();
	} catch (error) {
		next(error);
	}
	res.sendStatus(200);
};
export const importOnboardingComplete = async (req, res) => {
	try {
		const onboarding = await Onboarding.findOne({ user: req.user.id });
		onboarding.progress.csvImportViewed = true;
		await onboarding.save();
	} catch (error) {
		next(error);
	}
	res.sendStatus(200);
};
