import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export const shortenString = (string, maxLength, ellipsis = true) => {
	if (string.length <= maxLength) {
		return string;
	}
	return string.slice(0, maxLength) + (ellipsis ? '...' : '');
}