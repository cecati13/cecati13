const rootStyles = getComputedStyle(document.documentElement);
const contrastColor = rootStyles.getPropertyValue("--contrastColor").trim();
const fontColor = rootStyles.getPropertyValue("--fontColor").trim();

export const reloadSite = ({title, message, buttonText}) => {
  Swal.fire({
    title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: contrastColor,
    cancelButtonColor: fontColor,
    confirmButtonText: buttonText,
  }).then((result) => {
    result.isConfirmed
      ? location.reload()
      : (window.location.href = "/");
  });
};
