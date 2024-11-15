import html2canvas from "html2canvas"; // Changed from import * as 
import { data } from "./data/data";
import { saveAs as save } from "file-saver";

export function findIndex<T>(array: T[], callback: (point: T) => boolean) {
	for (let index = 0; index < array.length; index++) {
		if (callback(array[index])) {
			return index;
		}
	}
	return -1;
}

export function inRange(input: number, min: number, max: number) {
	return input >= min && input <= max;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		try {
			canvas.toBlob(blob => {
				if (!blob) {
					return reject(
						new Error("Could not convert canvas to blob")
					);
				}
				return resolve(blob);
			});
		} catch (e) {
			return reject(e);
		}
	});
}

function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function() {
				if (typeof reader.result === "string") {
					return resolve(reader.result);
				} else {
					return reject(
						new Error("Could not convert blob to base64")
					);
				}
			};
		} catch (e) {
			return reject(e);
		}
	});
}

export async function divToBase64(querySelector: string) {
    const el: HTMLElement | null = document.querySelector(querySelector);
    if (!el) {
        return "";
    }
    const canvas = await html2canvas(el, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        scale: window.devicePixelRatio
    });
    const blob = await canvasToBlob(canvas);
    const base64 = await blobToBase64(blob);
    return base64;
}

export function saveAs(base64: string, fileName: string) {
	save(base64, fileName);
}

export async function exportDiv(querySelector: string, name: string) {
	const base64 = await divToBase64(querySelector);
	saveAs(base64, name + ".png");
}

export function saveToPatient() {
	if (typeof window !== 'undefined' && window.top) {
        window.top.postMessage(
            "cephalometric-save:" +
            JSON.stringify({
                imgSource: data.imgSource,
                currentAnalysisName: data.currentAnalysisName,
                pointCoordinates: data.pointCoordinates
            }),
            "*"
        );
    } else {
        console.warn('Unable to access top window. Message could not be sent.');
    }
}

export function export2Base64() {
	const dataToSave = btoa(
		JSON.stringify({
			imgSource: data.imgSource,
			currentAnalysisName: data.currentAnalysisName,
			pointCoordinates: data.pointCoordinates
		})
	);

	const file = new Blob(["cephalometric_project:" + dataToSave], {
		type: "text/plain"
	});
	const fileName = prompt("File name");
	save(file, `${fileName || new Date().toLocaleDateString()}.cephalometric`);
}
