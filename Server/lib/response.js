"use strict";

const message = {
	1000: "성공",
	1001: "알 수 없는 에러",
	1002: "유효성 에러",
	1003: "해당 댓글이 존재하지 않거나 답변한 댓글입니다.",
	1004: "닉네임은 50자, 질문은 200자 제한",
	1005: "권한 없음"
};

module.exports = (status, code, data) => {
	let response = {};

	response["status"] = status;
	response["message"] = message[code];
	response["code"] = code;
	data ? response["result"] = data : null;

	return response;
};