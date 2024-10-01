export const typeFile = (extension) => {
  let type = "";
  switch (extension) {
    case "jpg":
      type = "image/jpg";
      break;
    case "jpeg":
      type = "image/jpeg";
      break;
    case "png":
      type = "image/png";
      break;
    default: //pdf
      type = "application/pdf";
      break;
  }
  return type;
};
