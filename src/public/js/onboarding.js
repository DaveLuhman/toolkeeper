document.addEventListener("DOMContentLoaded", () => {
    const skipButtons = document.querySelectorAll(".skip-step");

    for (const button of skipButtons) {
        button.addEventListener("click", async function () {
            const step = this.closest(".onboarding-step");
            const stepName = step.classList[1].replace("-step", "");

            try {
                const response = await fetch("/api/onboarding/skip", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ step: stepName }),
                });

                if (response.ok) {
                    step.closest(".onboarding-overlay").remove();
                }
            } catch (error) {
                console.error("Error skipping onboarding step:", error);
            }
        });
    }
});