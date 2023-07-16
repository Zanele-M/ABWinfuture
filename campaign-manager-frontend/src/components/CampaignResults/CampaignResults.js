var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import ABTestService from '../../services/api';
var CampaignResults = function () {
    var _a = useState([]), resultData = _a[0], setResultData = _a[1];
    useEffect(function () {
        var fetchResults = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ABTestService.getAllCampaignResults()];
                    case 1:
                        response = _a.sent();
                        if (Array.isArray(response)) {
                            setResultData(response);
                        }
                        else {
                            setResultData([response]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching campaign results:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchResults();
        var interval = setInterval(fetchResults, 15000);
        return function () { return clearInterval(interval); };
    }, []);
    var formatTime = function (seconds) {
        if (isNaN(seconds)) {
            return '-';
        }
        var days = Math.floor(seconds / (24 * 60 * 60));
        var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        var minutes = Math.floor((seconds % (60 * 60)) / 60);
        var secs = Math.floor(seconds % 60);
        var timeString = "".concat(secs, " seconds");
        if (days > 0)
            timeString = "".concat(days, " days ").concat(hours, " hours ").concat(minutes, " minutes ").concat(secs, " seconds");
        else if (hours > 0)
            timeString = "".concat(hours, " hours ").concat(minutes, " minutes ").concat(secs, " seconds");
        else if (minutes > 0)
            timeString = "".concat(minutes, " minutes ").concat(secs, " seconds");
        return timeString;
    };
    var pauseCampaign = function (campaignId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ABTestService.pauseCampaign(campaignId)];
                case 1:
                    _a.sent();
                    console.log("Campaign ".concat(campaignId, " paused successfully."));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error pausing campaign ".concat(campaignId, ":"), error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var resumeCampaign = function (campaignId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ABTestService.resumeCampaign(campaignId)];
                case 1:
                    _a.sent();
                    console.log("Campaign ".concat(campaignId, " resumed successfully."));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error resuming campaign ".concat(campaignId, ":"), error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var renderMetricsTable = function (result) {
        var _a, _b, _c, _d;
        return (React.createElement("div", { style: { marginBottom: '20px' }, key: result.campaign_id },
            React.createElement("div", { style: { border: '2px solid black', padding: '10px' } },
                React.createElement(Typography, { variant: "h6" },
                    "Campaign Name: ",
                    result.campaign_name),
                React.createElement(Typography, { variant: "body1" },
                    "Date Created: ",
                    result.date_created),
                React.createElement(Typography, { variant: "body1" },
                    "Confidence Interval: ",
                    result.confidence_interval),
                React.createElement(Typography, { variant: "body1" },
                    "Winner: ",
                    result.winner),
                React.createElement(Typography, { variant: "body1" },
                    "Analysis Time: ",
                    formatTime(result.analysis_time)),
                React.createElement(Typography, { variant: "body1" },
                    "Status: ",
                    result.status),
                result.status !== 'Paused' ? (React.createElement(Button, { variant: "contained", color: "secondary", onClick: function () { return pauseCampaign(result.campaign_id); } }, "Pause Campaign")) : (React.createElement(Button, { variant: "contained", color: "primary", onClick: function () { return resumeCampaign(result.campaign_id); } }, "Resume Campaign"))),
            React.createElement(Typography, { variant: "h6" }, "Control:"),
            React.createElement(Table, { style: { marginBottom: '20px' } },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, "Name"),
                        React.createElement(TableCell, null, "Total Views"),
                        React.createElement(TableCell, null, "Total Clicks"),
                        React.createElement(TableCell, null, "Click Through Rate"))),
                React.createElement(TableBody, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, ((_a = result.control) === null || _a === void 0 ? void 0 : _a.name) || 'N/A'),
                        React.createElement(TableCell, null, ((_b = result.control) === null || _b === void 0 ? void 0 : _b.total_views) || 'N/CA'),
                        React.createElement(TableCell, null, ((_c = result.control) === null || _c === void 0 ? void 0 : _c.total_clicks) || 'N/A'),
                        React.createElement(TableCell, null,
                            ((_d = result.control) === null || _d === void 0 ? void 0 : _d.ctr) ? result.control.ctr.toPrecision(2) : 'N/A',
                            "%")))),
            React.createElement(Typography, { variant: "h6" }, "Variants:"),
            React.createElement(Table, null,
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, "Name"),
                        React.createElement(TableCell, null, "Total Views"),
                        React.createElement(TableCell, null, "Total Clicks"),
                        React.createElement(TableCell, null, "Click Through Rate"))),
                React.createElement(TableBody, null, Array.isArray(result.variants) && result.variants.map(function (variant, index) { return (React.createElement(TableRow, { key: index },
                    React.createElement(TableCell, null, variant.name || 'N/A'),
                    React.createElement(TableCell, null, variant.total_views || 'N/A'),
                    React.createElement(TableCell, null, variant.total_clicks || 'N/A'),
                    React.createElement(TableCell, null,
                        variant.ctr ? variant.ctr.toPrecision(2) : 'N/A',
                        "%"))); })))));
    };
    return (React.createElement("div", null,
        React.createElement(Typography, { variant: "h4" }, "Campaign Results"),
        resultData.length > 0 ? (React.createElement("div", null,
            React.createElement(Typography, { variant: "h5", style: { marginTop: '20px' } }, "Results:"),
            resultData.map(function (result) { return renderMetricsTable(result); }))) : (React.createElement(Typography, { variant: "h5", style: { marginTop: '20px' } }, "No campaign results to display."))));
};
export default CampaignResults;
