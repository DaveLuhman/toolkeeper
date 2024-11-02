function toggleSection(parentElement) {
    const children = parentElement.querySelectorAll('.content');
    const arrow = parentElement.querySelector('.arrow i'); // Get the <i> element inside .arrow

    for (const child of children) {
        child.classList.toggle('expanded');
    }

    // Toggle between arrow classes
    arrow.classList.toggle('fa-arrow-right');
    arrow.classList.toggle('fa-arrow-down');
}