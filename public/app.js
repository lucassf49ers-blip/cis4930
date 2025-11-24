const form = document.getElementById("mood-form");
const intensityInput = document.getElementById("intensity");
const intensityValue = document.getElementById("intensityValue");
const loadingEl = document.getElementById("loading");
const responseEl = document.getElementById("response");
const responsePanel = document.getElementById("response-panel");

const levelEl = document.getElementById("response-level");
const sourceEl = document.getElementById("response-source");
const titleEl = document.getElementById("response-title");
const bodyEl = document.getElementById("response-body");
const imageEl = document.getElementById("response-image");
const carePlanEl = document.getElementById("care-plan");
const careReassuranceEl = document.getElementById("care-reassurance");
const careReasoningEl = document.getElementById("care-reasoning");
const microList = document.getElementById("micro-step-list");
const breathingContainer = document.getElementById("breathing-guides");
const resourceList = document.getElementById("resource-list");

intensityInput?.addEventListener("input", (event) => {
  intensityValue.textContent = event.target.value;
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.intensity = Number(payload.intensity || 0);
  payload.daysFeeling = Number(payload.daysFeeling || 0);

  toggleLoading(true);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to process right now. Please try again in a moment.");
    }

    const data = await response.json();
    renderResponse(data);
  } catch (error) {
    showError(error.message);
  } finally {
    toggleLoading(false);
  }
});

function toggleLoading(isLoading) {
  document.querySelector(".empty-state")?.classList.toggle("hidden", isLoading);
  loadingEl.classList.toggle("hidden", !isLoading);
  responseEl.classList.toggle("hidden", true);
}

function renderResponse(data) {
  loadingEl.classList.add("hidden");
  document.querySelector(".empty-state")?.classList.add("hidden");

  levelEl.textContent = `${data.level || "unknown"} level`;
  sourceEl.textContent = data.source === "gemini" ? "Gemini" : "Rule engine";
  titleEl.textContent = data.multimedia?.headline || "Guidance ready";
  bodyEl.textContent = data.multimedia?.body || "";

  if (carePlanEl && careReassuranceEl && careReasoningEl) {
    const hasCareText = Boolean(data.reassurance || data.reasoning);
    carePlanEl.classList.toggle("hidden", !hasCareText);
    if (hasCareText) {
      careReassuranceEl.textContent =
        data.reassurance ||
        "Thanks for sharing honestly. Let’s take the next small step together.";
      careReasoningEl.textContent = data.reasoning || "";
      careReasoningEl.classList.toggle("hidden", !data.reasoning);
    }
  }

  if (data.multimedia?.imageUrl) {
    imageEl.src = data.multimedia.imageUrl;
    imageEl.alt = data.multimedia.label || "Supportive visual";
  } else {
    imageEl.removeAttribute("src");
    imageEl.alt = "";
  }

  populateList(microList, data.microSteps || [], "micro");
  populateBreathing(breathingContainer, data.breathing || []);
  populateResources(resourceList, data.multimedia?.resources || []);

  responseEl.classList.remove("hidden");
  responsePanel.scrollIntoView({ behavior: "smooth" });
}

function populateList(listNode, items, type) {
  listNode.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Take a full breath and notice one thing you can control right now.";
    listNode.appendChild(li);
    return;
  }

  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    listNode.appendChild(li);
  });
}

function populateBreathing(container, guides) {
  container.innerHTML = "";
  guides.forEach((guide) => {
    const wrapper = document.createElement("div");
    wrapper.className = "breathing-guide";

    const title = document.createElement("h4");
    title.textContent = guide.title;
    wrapper.appendChild(title);

    const list = document.createElement("ol");
    guide.steps?.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });
    wrapper.appendChild(list);
    container.appendChild(wrapper);
  });
}

function populateResources(listNode, resources) {
  listNode.innerHTML = "";
  if (!resources.length) {
    const li = document.createElement("li");
    li.textContent = "Stay connected with someone you trust, and hydrate before your next step.";
    listNode.appendChild(li);
    return;
  }

  resources.forEach((resource) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = resource.label;
    li.appendChild(link);
    listNode.appendChild(li);
  });
}

function showError(message) {
  loadingEl.classList.add("hidden");
  responseEl.classList.add("hidden");
  const alert = document.createElement("div");
  alert.className = "breathing-guide";
  alert.style.borderColor = "rgba(237, 100, 166, 0.8)";
  alert.innerHTML = `<strong>Something went wrong.</strong> ${message}`;
  responsePanel.appendChild(alert);
  setTimeout(() => alert.remove(), 4000);
}
