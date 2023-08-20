document.addEventListener("DOMContentLoaded", function () {
  const projectsContainer = document.querySelector(".cd-projects-container"),
    projectsPreviewWrapper = projectsContainer.querySelector(
      ".cd-projects-previews"
    ),
    projectPreviews = projectsPreviewWrapper.querySelectorAll("li"),
    projects = projectsContainer.querySelector(".cd-projects"),
    navigationTrigger = document.querySelector(".cd-nav-trigger"),
    navigation = document.querySelector(".cd-primary-nav"),
    transitionsNotSupported =
      document.querySelectorAll(".no-csstransitions").length > 0;

  // 애니메이션 변수 선언
  let animating = false,
    numRandoms = projects.querySelectorAll("li").length,
    uniqueRandoms = [];

  // 프로젝트 미리보기 래퍼 클릭 이벤트 리스너
  projectsPreviewWrapper.addEventListener("click", function (event) {
    event.preventDefault();
    if (animating == false) {
      animating = true;
      navigationTrigger.classList.add("project-open");
      projectsContainer.classList.add("project-open");
      openProject(event.target.closest("li"));
    }
  });

  // 내비게이션 트리거 클릭 이벤트 리스너
  navigationTrigger.addEventListener("click", function (event) {
    event.preventDefault();
    if (animating == false) {
      animating = true;
      if (navigationTrigger.classList.contains("project-open")) {
        navigationTrigger.classList.remove("project-open");
        projectsContainer.classList.remove("project-open");
        closeProject();
      } else if (navigationTrigger.classList.contains("nav-visible")) {
        navigationTrigger.classList.remove("nav-visible");
        navigation.classList.remove("nav-clickable", "nav-visible");
        if (transitionsNotSupported)
          projectPreviews.forEach((preview) =>
            preview.classList.remove("slide-out")
          );
        else
          slideToggleProjects(
            projectsPreviewWrapper.querySelectorAll("li"),
            -1,
            0,
            false
          );
      } else {
        navigationTrigger.classList.add("nav-visible");
        navigation.classList.add("nav-visible");
        if (transitionsNotSupported)
          projectPreviews.forEach((preview) =>
            preview.classList.add("slide-out")
          );
        else
          slideToggleProjects(
            projectsPreviewWrapper.querySelectorAll("li"),
            -1,
            0,
            true
          );
      }
    }
    if (transitionsNotSupported) animating = false;
  });

  // 로드 후 함수
  function afterLoaded() {
    showPreview(projectPreviews[0]);
  }

  // 프로젝트 컨테이너 클릭 이벤트 리스너
  projectsContainer.addEventListener("click", function (event) {
    // 스크롤 클래스가 있는 경우
    if (event.target.classList.contains("scroll")) {
      // 프로젝트 컨테이너를 스무스하게 스크롤
      projectsContainer.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  });

  // 프로젝트 미리보기 표시 함수
  function showPreview(projectPreview) {
    if (projectPreview) {
      setTimeout(function () {
        projectPreview.classList.add("bg-loaded");
        showPreview(projectPreview.nextElementSibling);
      }, 150);
    }
  }

  // 프로젝트 열기 함수
  function openProject(projectPreview) {
    const projectIndex = Array.prototype.indexOf.call(
      projectPreviews,
      projectPreview
    );
    projects.querySelectorAll("li")[projectIndex].classList.add("selected");
    projectPreview.classList.add("selected");

    if (transitionsNotSupported) {
      projectPreviews.forEach((preview) => preview.classList.add("slide-out"));
      projectPreviews.forEach((preview) =>
        preview.classList.remove("selected")
      );
      projects
        .querySelectorAll("li")
        [projectIndex].classList.add("content-visible");
      animating = false;
    } else {
      slideToggleProjects(projectPreviews, projectIndex, 0, true);
    }
  }

  // 프로젝트 닫기 함수
  function closeProject() {
    let selectedProject = projects.querySelector(".selected");
    selectedProject.classList.remove("selected");
    selectedProject.addEventListener("transitionend", function (event) {
      event.target.classList.remove("content-visible");
      event.target.removeEventListener(event.type, arguments.callee);
      slideToggleProjects(
        projectsPreviewWrapper.querySelectorAll("li"),
        -1,
        0,
        false
      );
    });

    if (transitionsNotSupported) {
      projectPreviews.forEach((preview) =>
        preview.classList.remove("slide-out")
      );
      projects
        .querySelector(".content-visible")
        .classList.remove("content-visible");
      animating = false;
    }
  }

  // 슬라이드 토글 프로젝트 함수
  function slideToggleProjects(
    projectsPreviewWrapper,
    projectIndex,
    index,
    bool
  ) {
    if (index == 0) createArrayRandom();
    if (projectIndex != -1 && index == 0) index = 1;

    let randomProjectIndex = makeUniqueRandom();
    if (randomProjectIndex == projectIndex)
      randomProjectIndex = makeUniqueRandom();

    if (index < numRandoms - 1) {
      projectsPreviewWrapper[randomProjectIndex].classList.toggle(
        "slide-out",
        bool
      );
      setTimeout(function () {
        slideToggleProjects(
          projectsPreviewWrapper,
          projectIndex,
          index + 1,
          bool
        );
      }, 150);
    } else if (index == numRandoms - 1) {
      projectsPreviewWrapper[randomProjectIndex].classList.toggle(
        "slide-out",
        bool
      );
      projectsPreviewWrapper[randomProjectIndex].addEventListener(
        "transitionend",
        function (event) {
          if (projectIndex != -1) {
            projects
              .querySelector("li.selected")
              .classList.add("content-visible");
            projectsPreviewWrapper[projectIndex].classList.add("slide-out");
            projectsPreviewWrapper[projectIndex].classList.remove("selected");
          } else if (navigation.classList.contains("nav-visible") && bool) {
            navigation.classList.add("nav-clickable");
          }
          event.target.removeEventListener(event.type, arguments.callee);
          animating = false;
        }
      );
    }
  }

  // 유니크 랜덤 생성 함수
  function makeUniqueRandom() {
    let index = Math.floor(Math.random() * uniqueRandoms.length);
    let val = uniqueRandoms[index];
    uniqueRandoms.splice(index, 1);
    return val;
  }

  // 랜덤 배열 생성 함수
  function createArrayRandom() {
    uniqueRandoms.length = 0;
    for (let i = 0; i < numRandoms; i++) {
      uniqueRandoms.push(i);
    }
  }

  // 프로젝트 미리보기 forEach 반복문
  projectPreviews.forEach((preview) => {
    // 미리보기 링크 선택
    const previewLink = preview.querySelector("a");
    // 배경 이미지 가져오기
    const bgImgs = getComputedStyle(previewLink).backgroundImage.split(", ");
    // 이미지 URL 추출
    img = bgImgs[0].replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    // 이미지 객체 생성
    let image = new Image();
    image.src = img;
    // 이미지 로드 이벤트 리스너
    image.addEventListener("load", function () {
      afterLoaded(previewLink);
    });
  });
});
