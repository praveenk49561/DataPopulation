import fetch from 'node-fetch';
import { taskData } from "./data.js";
import { structureSaveDataAsReq, structureTaskDataAsReq } from "./structureAsReq.js";

const PILLAR_WISE_API_RESPONSE = {};
const SAVE_DATAPOINT_API_RESPONSES = [];
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOWFhMGVmMWQ2NGNkMDFlZWRhMDhjOCIsImlhdCI6MTY3NzU1Nzg5MH0.R7VE5fQd0ImMAR9yMC6-sKuinhZ7t2CBZxgTTytzaUs';
const BASE_URL = 'https://qa-backend.esgds.com/';
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
    process?.stdout?.write(`\n#### Fetching datapoints of ${task?.taskNumber}`);
    const reqData = structureTaskDataAsReq(task);

    const res = await hitPillarWiseAPI(reqData);
    const jsonRes = await res?.json();

    if (!res?.ok) { throw Error(`#### Error occurred while fetching datapoints of ${task?.taskNumber} - ${jsonRes?.message}`) }
    process?.stdout?.write(`\r\x1b[K`);
    process?.stdout?.write(`#### Successfully completed fetching of datapoints of ${task?.taskNumber}`);

    return jsonRes?.response.datapointList.dpCodesData;
};



const performSaveOperation = async (dps = [], task = {}) => {
    process?.stdout?.write(`\n#### Started updating datapoints of ${task?.taskNumber}\n`);
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
};

const main = async () => {
    try {
        console?.clear()
        process?.stdout?.write("\n#### Process has been started :)");
        const dps = await performDataPointsExtractOperation(taskData);
        await performSaveOperation(dps, taskData);
        process?.stdout?.write("\n#### Process has been completed :)");
    } catch (error) {
        console?.log(error);
    }
}


main();

