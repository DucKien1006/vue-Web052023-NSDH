export const clickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (
        !(el == event.target || el.contains(event.target)) &&
        !event.target.classList.contains(binding.arg)
      ) {
        binding.value();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent, true);
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent, true);
  },
};
