import mongoose from 'mongoose';

const OnboardingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	tenant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tenant',
		required: true,
		index: true
	},
	steps: {
		profileSetup: {
			type: Boolean,
			default: false
		},
		categoryCreated: {
			type: Boolean,
			default: false
		},
		serviceAssignmentCreated: {
			type: Boolean,
			default: false
		},
		firstToolAdded: {
			type: Boolean,
			default: false
		},
		csvImportViewed: {
			type: Boolean,
			default: false
		},
	},
	progress: {
		currentStep: {
			type: String,
			enum: ['profile', 'categories', 'services', 'tools', 'complete'],
			default: 'profile'
		},
		completedAt: {
			type: Date,
			default: null
		}
	}
}, {
	timestamps: true
});

// Add index for quick lookups
OnboardingSchema.index({ user: 1, tenant: 1 }, { unique: true });

// Method to check if onboarding is complete
OnboardingSchema.methods.isComplete = function() {
	return this.progress.completedAt !== null;
};

// Method to advance to next step
OnboardingSchema.methods.advanceStep = function() {
	const steps = ['profile', 'categories', 'services', 'tools', 'complete'];
	const currentIndex = steps.indexOf(this.progress.currentStep);

	if (currentIndex < steps.length - 1) {
		this.progress.currentStep = steps[currentIndex + 1];
		if (this.progress.currentStep === 'complete') {
			this.progress.completedAt = new Date();
		}
	}
};

export default OnboardingSchema;