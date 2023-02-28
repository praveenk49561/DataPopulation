export const structureSaveDataAsReq = (details = {}, taskDetails = {}) => ({
    "taskId": taskDetails?.taskId,
    "taskNumber": taskDetails?.taskNumber,
    "dpCodeId": details?.dpCodeId,
    "companyId": details?.companyId,
    "pillarId": details?.pillarId,
    "memberId": details?.memberId,
    "memberName": details?.memberName,
    "memberType": taskDetails?.dpType,
    "role": "SuperAdmin",
    "currentData": details?.fiscalYear?.split(',')?.map((eYear) => ({
        "dpCode": details?.dpCode,
        "fiscalYear": eYear?.trim(),
        "textSnippet": "",
        "pageNo": "",
        "dpName": details?.dpName,
        "screenShot": [],
        "response": "NA",
        "source": {
            "url": "",
            "sourceName": "",
            "value": "",
            "publicationDate": ""
        },
        "isRestated": "No",
        "restatedForYear": "",
        "restatedInYear": "",
        "restatedValue": "",
        "childDp": [],
        "optionalAnalystComment": "",
        "additionalDetails": {},
        "subDataType": {
            "measure": "NA",
            "placeValues": [],
            "selectedPlaceValue": {
                "value": "63bbd5b37ef39ca594ef6d2e",
                "label": "Number"
            },
            "uoms": []
        },
        "collectionYear": eYear?.trim()
    })),
    "historicalData": []
});

export const structureTaskDataAsReq = (details = {}) => ({
    "taskId": details?.taskId,
    "dpType": details?.dpType,
    "keyIssueId": details?.keyIssueId,
    "memberId": details?.memberId,
    "memberName": details?.memberName,
    "dataType": details?.dpType,
    "categoryId": details?.categoryId,
    "page": details?.page,
    "limit": details?.limit,
    "searchValue": details?.searchValue,
    "dpStatus": details?.dpStatus,
});