export const inputFiles = (multiple: boolean, cb?: (files: File[]) => void) => {
    const input = document.createElement("input"); // these elements are never removed but its fine
    input.setAttribute("type", "file");
    input.setAttribute("multiple", multiple.toString());
    input.addEventListener('change', (e) => {
        if (cb) {
            cb(Array.from(input.files));
        }
        
    });
    input.click();
}

export const inputDirectory = (cb?: (files: File[]) => void) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("webkitdirectory", "true");
    input.setAttribute("mozdirectory", "true");
    input.addEventListener('change', (e) => {
        if (cb) {
            cb(Array.from(input.files));
        }
    });
    input.click();
}

