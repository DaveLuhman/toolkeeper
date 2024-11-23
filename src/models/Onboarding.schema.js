import mongoose from "mongoose";

const OnboardingSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		completedAt: {
			type: Date,
			default: null,
		},
		progress: {
			dashboardCompleted: {
				// completed the onboarding flow
				type: Boolean,
				default: false,
			},
			profileSetup: {
				// acknowledgement step for profile setup
				type: Boolean,
				default: false,
			},
			categoryCreated: {
				// created a category
				type: Boolean,
				default: false,
			},
			serviceAssignmentCreated: {
				// created a service assignment
				type: Boolean,
				default: false,
			},
			firstToolAdded: {
				// added a first tool
				type: Boolean,
				default: false,
			},
			csvImportViewed: {
				// downloaded a csv template for importing SA, C, T
				type: Boolean,
				default: false,
			},
			usersSetup: {
				// completed the users setup flow
				type: Boolean,
				default: false,
			},
		},
	},
	{
		timestamps: true,
	},
);

// Virtual field to return the last compeleted step
OnboardingSchema.virtual("lastCompletedStep").get(function () {
	const steps = [
		"profileSetup",
		"categoryCreated",
		"serviceAssignmentCreated",
		"firstToolAdded",
		"csvImportViewed",
		"usersSetup",
	];
	const completedSteps = steps.filter((step) => this.progress[step]);
	return completedSteps.length > 0
		? completedSteps[completedSteps.length - 1]
		: null;
});

// virtual field to return the next step to be completed
OnboardingSchema.virtual("nextStep").get(function () {
	const steps = [
		"profileSetup",
		"categoryCreated",
		"serviceAssignmentCreated",
		"firstToolAdded",
		"csvImportViewed",
		"usersSetup",
	];
	const completedSteps = steps.filter((step) => this.progress[step]);
	return completedSteps.length < steps.length
		? steps[completedSteps.length]
		: null;
});

// function to mark a provided step as completed
OnboardingSchema.methods.markStepAsCompleted = function (step) {
	if (this.progress[step]) {
		this.progress[step] = true;
		this.save();
	}
};
// Add index for quick lookups
OnboardingSchema.index({ user: 1, tenant: 1 }, { unique: true });

// Method to check if onboarding is complete
OnboardingSchema.methods.isComplete = function () {
	return this.completedAt !== null;
};

export default OnboardingSchema;
