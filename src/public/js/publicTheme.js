// Check for saved theme preference, otherwise use system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.body.classList.remove('bg-gradient-to-b', 'from-zinc-100', 'to-slate-600');
    document.body.classList.add('bg-gradient-to-b', 'from-zinc-900', 'to-slate-800');
} else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-gradient-to-b', 'from-zinc-900', 'to-slate-800');
    document.body.classList.add('bg-gradient-to-b', 'from-zinc-100', 'to-slate-600');
}

// Theme toggle button functionality
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', () => {
    // Toggle icons
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // If is dark mode
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gradient-to-b', 'from-zinc-900', 'to-slate-800');
        document.body.classList.add('bg-gradient-to-b', 'from-zinc-100', 'to-slate-600');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-gradient-to-b', 'from-zinc-100', 'to-slate-600');
        document.body.classList.add('bg-gradient-to-b', 'from-zinc-900', 'to-slate-800');
        localStorage.theme = 'dark';
    }
});