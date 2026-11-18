import { getHealth } from "../services/NqdHealthService.js";
import { sendResponse } from "../utils/NqdResponse.js";

export const health = (req, res) => {
    const data = getHealth();

    return sendResponse(res, 200, {
        success: true,
        data,
        message: "API đang hoạt động"
    });
};