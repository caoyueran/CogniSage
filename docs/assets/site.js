const config = window.COGNISAGE_SITE_CONFIG || {};
const feedbackForm = document.querySelector("#feedback-form");
const feedbackStatus = document.querySelector("#feedback-status");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle-label");

const setTheme = (theme) => {
  const isLight = theme === "light";
  document.body.classList.toggle("theme-light", isLight);
  themeToggle?.setAttribute("aria-pressed", String(isLight));
  themeToggle?.setAttribute("aria-label", isLight ? "切换至暗色模式" : "切换至明亮模式");
  if (themeToggleLabel) themeToggleLabel.textContent = isLight ? "暗色模式" : "明亮模式";
  document.querySelectorAll("[data-light-src][data-dark-src]").forEach((image) => {
    image.src = image.dataset[isLight ? "lightSrc" : "darkSrc"];
  });
};

const storedTheme = window.localStorage.getItem("cognisage-theme");
setTheme(storedTheme === "dark" ? "dark" : "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("theme-light") ? "dark" : "light";
  window.localStorage.setItem("cognisage-theme", nextTheme);
  setTheme(nextTheme);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#feedback-title").value.trim();
  const area = document.querySelector("#feedback-area").value;
  const body = document.querySelector("#feedback-body").value.trim();
  const repositoryUrl = config.repositoryUrl;

  if (!title || body.length < 10) {
    feedbackStatus.textContent = "请填写主题，并提供至少 10 个字符的具体建议。";
    return;
  }
  if (!repositoryUrl || repositoryUrl.includes("REPLACE_WITH")) {
    feedbackStatus.textContent = "GitHub 仓库地址将在发布前写入配置，当前无法跳转提交。";
    return;
  }

  const issueBody = [
    "## 评委改进建议",
    "",
    `**评审方向：** ${area}`,
    "",
    "### 具体建议",
    body,
    "",
    "---",
    "由 VulnSage 项目展示页生成。",
  ].join("\n");
  const issueUrl = new URL(`${repositoryUrl.replace(/\/$/, "")}/issues/new`);
  issueUrl.searchParams.set("template", "judge-feedback.yml");
  issueUrl.searchParams.set("title", `[评审建议] ${title}`);
  issueUrl.searchParams.set("labels", "judge-feedback");
  issueUrl.searchParams.set("body", issueBody);
  window.open(issueUrl.toString(), "_blank", "noopener,noreferrer");
  feedbackStatus.textContent = "已打开 GitHub Issue 表单。感谢你的建议。";
});
