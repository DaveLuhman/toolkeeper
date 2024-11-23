import { Onboarding } from "../models/index.models.js";

export const hoistOnboarding = async (req, res, next) => {
	try {
		// Fetch user's onboarding document
		const onboardingDoc = await Onboarding.findOne({ user: req.user._id });
		res.locals.onboarding = onboardingDoc;
		console.log("Onboarding Hoisted");
		next();
	} catch (error) {
		// Pass the error to the error-handling middleware
		next(new Error("Failed to locate onboarding document"));
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

export const dashboardOnboardingComplete = async (req, res, next) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.dashboardCompleted = true;

	await onboarding.save();
	res.locals.onboarding = onboarding;
	res.sendStatus(200);
};

export const profileOnboardingComplete = async (req, res, next) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.profileSetup = true;
	await onboarding.save();
	res.sendStatus(200);
};

export const usersOnboardingComplete = async (req, res, next) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.usersSetup = true;
	await onboarding.save();
	res.sendStatus(200);
};
export const importOnboardingComplete = async (req, res, next) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.progress.csvImportViewed = true;
	await onboarding.save();
};
