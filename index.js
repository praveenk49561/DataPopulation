import fetch from 'node-fetch';
import { taskData } from "./data.js";
import { loader } from './loader.js';
import { structureSaveDataAsReq, structureTaskDataAsReq } from "./structureAsReq.js";

let PILLAR_WISE_API_RESPONSE = {};
const SAVE_DATAPOINT_API_RESPONSES = [];
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOWFhMGVmMWQ2NGNkMDFlZWRhMDhjOCIsImlhdCI6MTY3NzU1Nzg5MH0.R7VE5fQd0ImMAR9yMC6-sKuinhZ7t2CBZxgTTytzaUs';
const BASE_URL = 'http://localhost:9010/';
const PILLAR_WISE_URL = `${BASE_URL}/datapoints/list/pillarwise`;
const SAVE_DATAPOINT_URL = `${BASE_URL}/standalone_datapoints/saveDatapointDetails`;

const hitSaveDataPointDetailsAPI = async(payload = {}) => {
    return await fetch(SAVE_DATAPOINT_URL, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
    });
};


const hitPillarWiseAPI = async(payload = {}) => {
    return await fetch(PILLAR_WISE_URL, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
    });
};

const performDataPointsExtractOperation = async (task = {}) => {
    const { taskNumber, memberName, dpType } = task;
    const isStandalone = dpType === 'Standalone';
    
    process?.stdout?.write(`\n#### Fetching the ${isStandalone || memberName ? `datapoints` : `members`} of ${memberName ? `member ${memberName} of ` : ``}${taskNumber}`);
    const reqData = structureTaskDataAsReq(task);

    const res = await hitPillarWiseAPI(reqData);
    const jsonRes = await res?.json();

    if (!res?.ok) { throw Error(`#### Error occurred while fetching the ${isStandalone || memberName ? `datapoints` : `members`} of ${memberName ? `member ${memberName} of ` : ``}${taskNumber} - ${jsonRes?.message}`) }
    process?.stdout?.write(`\r\x1b[K`);
    process?.stdout?.write(`#### Successfully completed fetching the ${isStandalone || memberName ? `datapoints` : `members`} of ${memberName ? `member ${memberName} of ` : ``}${taskNumber}`);

    PILLAR_WISE_API_RESPONSE = jsonRes?.response;

    return { dps: jsonRes?.response?.datapointList?.dpCodesData, members: jsonRes?.response?.datapointList?.memberList };
};



const performSaveOperation = async (dps = [], task = {}) => {
    if (dps?.length < 1) {
        process?.stdout?.write(`\n#### Aborting !!!, As no datapoints were present.`);
        process?.stdout?.write(`\n`);
        return;
    }
    process?.stdout?.write(`\n#### Started updating datapoints of ${task?.memberName ? `member ${task?.memberName} of ` : ``}${task?.taskNumber}`);
    for (let i = 0; i < dps?.length; i++) {
        const reqData = structureSaveDataAsReq(dps[i], taskData);

        const res = await hitSaveDataPointDetailsAPI(reqData)
        const jsonRes = await res?.json();

        SAVE_DATAPOINT_API_RESPONSES?.push({ dpCode: dps[i]?.dpCode, status: jsonRes?.status, message: jsonRes?.message });

        if (i > 0) { 
            process?.stdout?.write(`\r\x1b[K`);
            process?.stdout?.write(`#### Status: ${i + 1}/${dps?.length} Dp's Data Has Been Sent.`);
        } else {
            process?.stdout?.write(`\n#### Status: ${i + 1}/${dps?.length} Dp's Data Has Been Sent.`);
        }
    }
    process?.stdout?.write(`\n`);
};

const performRequiredDpTypeOperation = async (task = {}) => {
    const { dpType, memberId, memberName } = task;
    const isStandalone = dpType === 'Standalone';
    const { dps, members } = await performDataPointsExtractOperation(task);
    process?.stdout?.write(`\n`);

    if (isStandalone) {
        await performSaveOperation(dps, task);
    } else if (!isStandalone && (!!memberId && !!memberName)) {
        await performSaveOperation(dps, task);
    } else {
        for (let i = 0; i < members?.length; i++) {
            const { label, label1, value } = members[i];
            const isTerminated = label1?.includes('terminated');

            if (isTerminated) continue;

            const redefinedTask = { ...task, memberId: value, memberName: label };
            const { dps } = await performDataPointsExtractOperation(redefinedTask);
            await performSaveOperation(dps, redefinedTask);
        }
    }

}


const main = async () => {
    try {
        console?.clear();
        process?.stdout?.write(`\n`);
        
        await loader();
        process?.stdout?.write("\n#### Process has been started :)");
        process?.stdout?.write("\n################################");
        await performRequiredDpTypeOperation(taskData);
        process?.stdout?.write("\n################################");
        process?.stdout?.write("\n#### Process has been completed :)");
    } catch (error) {
        console?.log(error);
    }
}


main();

