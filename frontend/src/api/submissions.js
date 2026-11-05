
export async function createSubmission(userId, data) {
    const response = await fetch(
        `/api/v1/submissions/?user_id=${userId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error("잘못된 API 응답:", response.status, text);

        throw new Error(
            `백엔드에서 JSON이 아닌 응답을 받았습니다. (${response.status})`
        );
    }

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            `리뷰 저장 실패 (${response.status}): ${JSON.stringify(result.detail || result)}`
        );
    }

    return result;
}
