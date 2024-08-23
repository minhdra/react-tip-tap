export const formatUrlUpload = (value?: string | null) => {
  if (value?.includes("http://") || value?.includes("https://")) return value;
  return "/api/" + value;
};

// Function to extract src attributes from img elements in HTML
export function extractImgListSrc(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgElements = doc.querySelectorAll("img");
  const listSrc = Array.from(imgElements).map((img) => decodeURI(img.src));
  return listSrc;
}

export function throttle(func: any, delay: number) {
  let lastCall = 0;
  return function (...args: any) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}