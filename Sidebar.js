// 1. '새 페이지' 버튼을 가져오기
const addPageButton = document.querySelector(".add_content_box");

// 2. '새 페이지' 버튼 클릭 시 이벤트 리스너 추가
addPageButton.addEventListener("click", async () => {
  // 3. 새 페이지 동적으로 생성
  const newPage = document.createElement("div");
  newPage.classList.add("new-page"); // 새 페이지에 추가할 클래스를 정의 (스타일링을 위해)

  // 새 페이지의 내용 작성 (예: 제목과 기본 텍스트)
  newPage.innerHTML = `
    <div class="header">
      <div class="header_box">
        <div class="title_box">
          <div>📄</div>
          <h2 class="page-title" contenteditable="true">새로운 페이지</h2> <!-- 제목에 contenteditable 속성 추가 -->
        </div>
        <div class="side_icon">
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
    </div>
    <div class="container">
      <p>여기에 새로운 페이지 내용을 추가하세요.</p>
    </div>
  `;

  // 4. 생성된 페이지를 'content' 영역에 추가
  const contentArea = document.querySelector(".content");
  contentArea.appendChild(newPage);

  // 5. 추가된 페이지에 삭제 기능 추가
  const deleteIcon = newPage.querySelector(".side_icon");
  deleteIcon.addEventListener("click", () => {
    newPage.remove(); // 페이지 삭제
    // 사이드바에서 해당 페이지 삭제
    sidebar.removeChild(newSidebarItem);
  });

  // 6. 사이드바에 새 페이지 추가
  const sidebar = document.querySelector(".menu ul"); // 사이드바의 ul 요소를 선택
  const newSidebarItem = document.createElement("li");
  newSidebarItem.classList.add("sidebar-page");
  newSidebarItem.innerHTML = `
    <div class="menu_box">
      <div class="icon">📄</div>
      <div class="menu_text page-name" contenteditable="true">새로운 페이지</div> <!-- 사이드바 제목도 contenteditable 추가 -->
    </div>
  `;

  // 7. 새 페이지를 사이드바에 추가
  sidebar.appendChild(newSidebarItem);

  // 8. 사이드바 제목 수정 시 페이지 제목도 실시간으로 수정되도록
  const sidebarPageName = newSidebarItem.querySelector(".page-name");
  const pageTitle = newPage.querySelector(".page-title");

  // 사이드바 제목 수정 시 페이지 제목 변경
  sidebarPageName.addEventListener("input", () => {
    pageTitle.textContent = sidebarPageName.textContent;
  });

  // 페이지 제목 수정 시 사이드바 제목 변경
  pageTitle.addEventListener("input", () => {
    sidebarPageName.textContent = pageTitle.textContent;
  });

  // 9. 엔터 키를 눌렀을 때 제목 저장
  pageTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 엔터 키가 기본 동작을 하지 않도록 방지
      pageTitle.blur(); // 제목 편집을 마치고 blur 이벤트를 트리거
    }
  });

  // 10. 제목 수정이 끝났을 때 제목 저장
  pageTitle.addEventListener("blur", async () => {
    const newTitle = pageTitle.textContent.trim();
    if (newTitle) {
      pageTitle.textContent = newTitle;
      sidebarPageName.textContent = newTitle; // 페이지 제목을 사이드바에도 반영
    } else {
      pageTitle.textContent = "새로운 페이지"; // 기본값으로 설정
      sidebarPageName.textContent = "새로운 페이지"; // 사이드바 제목도 기본값으로 설정
    }

    // 11. 서버에 새 페이지 생성 요청 (API 호출)
    try {
      const createdDocument = await api.createDocument(newTitle); // API 호출
      console.log("새 페이지가 서버에 저장되었습니다:", createdDocument);

      // 서버에서 응답받은 데이터로 페이지 ID를 업데이트 할 수 있습니다.
      newPage.id = createdDocument.id; // 응답으로 받은 ID를 페이지 ID로 설정
      newSidebarItem.dataset.id = createdDocument.id; // 사이드바 항목에 ID 추가
    } catch (error) {
      console.error("문서 저장 실패:", error);
    }
  });

  // 12. 사이드바에서 페이지 클릭 시 해당 페이지 표시
  newSidebarItem.addEventListener("click", () => {
    // 모든 페이지 숨기기
    const allPages = document.querySelectorAll(".new-page");
    allPages.forEach((page) => (page.style.display = "none"));

    // 클릭한 페이지만 보이게 설정
    newPage.style.display = "block";
  });
});
