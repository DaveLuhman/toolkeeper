import { Onboarding } from "../models/index.models.js";

const hoistOnboardingToSession = async (req, res, next) => {
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

export default hoistOnboardingToSession;