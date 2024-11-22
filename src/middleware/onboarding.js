import { Onboarding } from "../models/index.models.js";

export const hoistOnboarding = async (req, res, next) => {
    try {
        // Fetch user's onboarding document
        const onboardingDoc = await Onboarding.findOne({ user: req.user._id });
        req.session.onboarding = onboardingDoc;
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
	next()
}

export const onboardingComplete = async (req, res, next) => {
	const onboarding = await Onboarding.findOne({ user: req.user.id });
	onboarding.completedAt = new Date();
    onboarding.progress = {
        profileSetup: true,
        categoryCreated: true,
        serviceAssignmentCreated: true,
        toolCreated: true,
        csvImported: true,
    }
	await onboarding.save();
	res.locals.onboarding = onboarding;
	next();
}
