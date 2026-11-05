const BASE_URL = "/api/v1/users";

export async function getUser(userId) {
  const response = await fetch(`${BASE_URL}/${userId}`);

  if (!response.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return response.json();
}
