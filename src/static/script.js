// Configurable Weapon Presets
const WEAPON_PRESETS = [
    { name: "PzH 2000 (3km)", maxRange: 3000.00 },
    { name: "Light Mortar (800m)", maxRange: 800.00 },
    { name: "Heavy Mortar (1.5km)", maxRange: 1500.00 }
];

let toastTimeout;

function showWarning(message) {
    const toast = document.getElementById("toastWarning");
    const toastMessage = document.getElementById("toastMessage");

    // Set the message content
    toastMessage.textContent = message;

    // Reset timer if triggered again while open
    clearTimeout(toastTimeout);

    // Show popup
    toast.classList.add("toast-show");

    // Hide popup after 3 seconds (3000 ms)
    toastTimeout = setTimeout(() => {
        toast.classList.remove("toast-show");
    }, 3000);
}

async function callEndpoint(path, payload, callback) {
    try {
            const response = await fetch(path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (!callback) return
                const data = await response.json();
                callback(data);
            } else {
                showWarning("Failed to fetch endpoint " + path + " code: " + response.status);
            }
        } catch (error) {
            console.error(error);
            showWarning("Failed to fetch endpoint " + path);
        }
}

document.addEventListener("DOMContentLoaded", () => {
    const presetSelect = document.getElementById("weaponPreset");
    const maxRangeInput = document.getElementById("maxRange");
    const coordScaleInput = document.getElementById("coordScale");
    const originForm = document.getElementById("originForm");
    const targetForm = document.getElementById("targetForm");
    const resultsCard = document.getElementById("resultsCard");

    // Format all coordinate inputs to 2 decimal places on blur
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener("blur", (e) => {
            if (e.target.value !== "") {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        });
    });

    // Populate weapon preset dropdown
    WEAPON_PRESETS.forEach((preset, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
    });

    // Handle preset changes
    presetSelect.addEventListener("change", (e) => {
        const selected = e.target.value;
        if (selected !== "custom") {
            const preset = WEAPON_PRESETS[selected];
            maxRangeInput.value = preset.maxRange.toFixed(2);
        }
    });

    // Reset preset dropdown to 'custom' if max range is manually edited
    maxRangeInput.addEventListener("input", () => {
        presetSelect.value = "custom";
    });

    // Set Origin Endpoint Call
    originForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            x: parseFloat(document.getElementById("originX").value),
            y: parseFloat(document.getElementById("originY").value)
        };

        await callEndpoint("/origin", payload);
    });

    // Calculate Target Endpoint Call
    targetForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            x: parseFloat(document.getElementById("targetX").value),
            y: parseFloat(document.getElementById("targetY").value)
        };

        await callEndpoint("/calculate", payload, (data) => {
            displayResults(data.distance, data.bearing);
        });
    });

    coordScaleInput.addEventListener("blur", async (e) => {
        const payload = {
            scale: parseFloat(document.getElementById("coordScale").value)
        }

        await callEndpoint("/scale", payload);
    })

    // Update Results and check Range Warning
    function displayResults(distance, bearing) {
        const distFloat = parseFloat(distance);
        const maxRange = parseFloat(maxRangeInput.value);

        document.getElementById("distanceValue").textContent = `${distFloat.toFixed(2)} m`;
        document.getElementById("bearingValue").textContent = `${parseFloat(bearing).toFixed(2)}°`;

        if (!isNaN(maxRange) && distFloat > maxRange) {
            resultsCard.parentElement.classList.add("warning-active");
        } else {
            resultsCard.parentElement.classList.remove("warning-active");
        }
    }
});