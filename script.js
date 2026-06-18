document.addEventListener("DOMContentLoaded", function () {
    // We store the card that the user is currently dragging.
    // This lets the drop handler know exactly which card should move.
    var draggedCard = null;

    // We grab the main buttons and lists that the script needs to control.
    // These elements are the connection points between the HTML and the JavaScript.
    var newTaskButton = document.getElementById("new-task-button");
    var taskLists = document.querySelectorAll(".task-list");
    var taskCards = document.querySelectorAll(".task-card");
    var reviewEmptyState = document.getElementById("review-empty-state");
    
    // We start the new-card counter after the existing cards on the page.
    // This keeps every future card id unique.
    var nextCardNumber = taskCards.length + 1;

    // We give every existing card a draggable id and attach the drag events.
    // This makes the cards on the page behave the same as any cards we create later.
    for (var i = 0; i < taskCards.length; i++) {
        prepareTaskCard(taskCards[i]);
    }

    // We attach drag-and-drop listeners to every column list.
    // The lists need these events so they can accept cards that are dropped into them.
    for (var j = 0; j < taskLists.length; j++) {
        prepareTaskList(taskLists[j]);
    }

    // We connect the "New Task" button so it creates a new card when clicked.
    if (newTaskButton) {
        newTaskButton.addEventListener("click", function () {
            createNewTask();
        });
    }

    // We update the empty-state message once at the start.
    // This keeps the board in a clean state before the user begins moving cards.
    updateReviewEmptyState();

    // This function prepares one card so the browser can drag it.
    // It also gives the card a unique id if it does not already have one.
    function prepareTaskCard(card) {
        if (!card.id) {
            card.id = "task-card-" + nextCardNumber;
            nextCardNumber = nextCardNumber + 1;
        }

        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
    }

    // This function prepares one column list so it can accept dropped cards.
    // The drag events on the list are what make the column a valid drop target.
    function prepareTaskList(list) {
        list.addEventListener("dragover", handleDragOver);
        list.addEventListener("dragenter", handleDragEnter);
        list.addEventListener("dragleave", handleDragLeave);
        list.addEventListener("drop", handleDrop);
    }

    // This runs when the user starts dragging a card.
    // We save the card in a variable and tell the browser that a move is happening.
    function handleDragStart(event) {
        draggedCard = this;
        this.classList.add("dragging");

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", this.id);
        }
    }

    // This runs when the user stops dragging a card.
    // We remove the visual dragging style and clear the stored card reference.
    function handleDragEnd() {
        this.classList.remove("dragging");
        draggedCard = null;
        clearDragHighlights();
        updateReviewEmptyState();
    }

    // This runs while a card is being dragged over a column.
    // The preventDefault call is required so the browser allows the drop.
    function handleDragOver(event) {
        event.preventDefault();
        this.classList.add("drag-over");

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }
    }

    // This runs when the dragged card first enters a column.
    // We add a small highlight so the user can see where the card may land.
    function handleDragEnter(event) {
        event.preventDefault();
        this.classList.add("drag-over");
    }

    // This runs when the dragged card leaves a column.
    // We remove the highlight so only the active drop target stays visible.
    function handleDragLeave() {
        this.classList.remove("drag-over");
    }

    // This runs when the user drops the card onto a column.
    // We move the dragged card into the new list and then refresh the empty-state message.
    function handleDrop(event) {
        event.preventDefault();
        this.classList.remove("drag-over");

        if (!draggedCard) {
            return;
        }

        this.appendChild(draggedCard);
        clearDragHighlights();
        updateReviewEmptyState();
    }

    // This removes the drop highlight from every list.
    // It keeps the board from looking stuck in a drag state after the mouse is released.
    function clearDragHighlights() {
        for (var i = 0; i < taskLists.length; i++) {
            taskLists[i].classList.remove("drag-over");
        }
    }

    // This checks whether the In Review column has at least one real task card.
    // If the column is empty, we show the placeholder message again.
    function updateReviewEmptyState() {
        if (!reviewEmptyState) {
            return;
        }

        var reviewList = document.getElementById("in-review-list");

        if (!reviewList) {
            return;
        }

        var reviewCards = reviewList.querySelectorAll(".task-card");

        if (reviewCards.length === 0) {
            reviewEmptyState.style.display = "flex";
        } else {
            reviewEmptyState.style.display = "none";
        }
    }

    // This runs when the user clicks the New Task button.
    // It asks for a title, creates a brand new card, and places it in the To Do column.
    function createNewTask() {
        var taskTitle = window.prompt("Enter a title for the new task:", "New Task");

        if (taskTitle === null) {
            taskTitle = "New Task";
        } else {
            taskTitle = taskTitle.trim();

            if (taskTitle === "") {
                taskTitle = "New Task";
            }
        }

        var newCard = createTaskCard(taskTitle);
        var todoList = document.getElementById("to-do-list");

        if (todoList) {
            todoList.appendChild(newCard);
        }
    }

    // This builds one new task card from scratch using standard DOM methods.
    // The card is built piece by piece so the code is easy to explain in class.
    function createTaskCard(taskTitle) {
        var card = document.createElement("div");
        card.className = "task-card bg-[#FFFFFF] p-md rounded-lg border border-[#E5E7EB] custom-shadow cursor-pointer hover:border-[#D1D5DB] transition-all group flex flex-col gap-sm";
        card.id = "task-card-" + nextCardNumber;
        nextCardNumber = nextCardNumber + 1;
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);

        // This top row holds the label and the small menu icon.
        var topRow = document.createElement("div");
        topRow.className = "flex justify-between items-start gap-sm";
        card.appendChild(topRow);

        // This label tells the user what kind of task the card represents.
        var label = document.createElement("span");
        label.className = "bg-[#DBEAFE] text-[#1E40AF] text-label-sm font-label-sm px-2 py-0.5 rounded-[4px]";
        label.textContent = "Task";
        topRow.appendChild(label);

        // This menu button is only visual here, but it keeps the new card looking like the others.
        var menuButton = document.createElement("button");
        menuButton.className = "text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity";

        var menuIcon = document.createElement("span");
        menuIcon.className = "material-symbols-outlined text-[18px]";
        menuIcon.textContent = "more_horiz";
        menuButton.appendChild(menuIcon);
        topRow.appendChild(menuButton);

        // This heading holds the title that the user typed into the prompt.
        var title = document.createElement("h3");
        title.className = "text-body-md font-body-md font-medium text-on-surface";
        title.textContent = taskTitle;
        card.appendChild(title);

        // This footer keeps the date and avatar area so the card matches the rest of the board.
        var footer = document.createElement("div");
        footer.className = "flex items-center justify-between mt-sm pt-sm border-t border-[#F3F4F6]";
        card.appendChild(footer);

        // This date block is a simple placeholder so the card feels complete.
        var dateBlock = document.createElement("div");
        dateBlock.className = "flex items-center gap-xs text-secondary text-label-sm font-label-sm";
        footer.appendChild(dateBlock);

        var dateIcon = document.createElement("span");
        dateIcon.className = "material-symbols-outlined text-[14px]";
        dateIcon.textContent = "calendar_today";
        dateBlock.appendChild(dateIcon);

        var dateText = document.createElement("span");
        dateText.textContent = "Today";
        dateBlock.appendChild(dateText);

        // This avatar circle gives the card a finished look without needing extra data.
        var avatar = document.createElement("div");
        avatar.className = "w-6 h-6 rounded-full overflow-hidden border border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant";
        avatar.textContent = "ME";
        footer.appendChild(avatar);

        return card;
    }
});
