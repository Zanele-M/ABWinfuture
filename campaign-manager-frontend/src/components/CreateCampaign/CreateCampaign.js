var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import ABTestService from '../../services/api';
import { styled } from '@mui/material/styles';
import { Button, TextField, Container, Box, Typography } from "@mui/material";
import { Delete } from '@mui/icons-material';
var FormContainer = styled('form')({
    '& .MuiTextField-root': {
        margin: '8px',
        width: '25ch',
    },
});
var VariantName = styled(Typography)({
    fontSize: '0.875rem',
    color: 'rgba(0, 0, 0, 0.54)',
    marginBottom: '8px', // space between name and identifier
});
var LineInput = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)', // You can adjust color and thickness as you need
        },
        '&:hover fieldset': {
            border: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        '&.Mui-focused fieldset': {
            border: 'none',
            borderBottom: '2px solid #3f51b5', // Typically a focused input might have a slightly thicker and/or different colored border
        },
    },
});
var CreateCampaign = function (props) {
    var setCurrentTab = props.setCurrentTab;
    var _a = useState({
        campaign_name: '',
        contro_name: 'Original',
        control_identifier: '',
        type: '',
        variants: [
            {
                name: 'Variant A',
                identifier: '',
            }
        ]
    }), campaignData = _a[0], setCampaignData = _a[1];
    var _b = useState(1), variantCount = _b[0], setVariantCount = _b[1];
    useEffect(function () {
        setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: prevData.variants.map(function (variant, i) { return (__assign(__assign({}, variant), { name: prevData.type ? "".concat(campaignData.type.charAt(0).toUpperCase() + campaignData.type.slice(1), " ").concat(String.fromCharCode(65 + i)) : "Alternative Element ".concat(String.fromCharCode(65 + i)) })); }) })); });
    }, [variantCount, campaignData.type]);
    var handleInputChange = function (event) {
        var _a = event.target, name = _a.name, value = _a.value;
        setCampaignData(function (prevData) {
            var _a;
            return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleRemoveVariant = function (indexToRemove) {
        setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: prevData.variants.filter(function (_, index) { return index !== indexToRemove; }) })); });
        setVariantCount(variantCount - 1);
    };
    var handleVariantChange = function (event, index) {
        var _a;
        var _b = event.target, name = _b.name, value = _b.value;
        var updatedVariants = __spreadArray([], campaignData.variants, true);
        updatedVariants[index] = __assign(__assign({}, updatedVariants[index]), (_a = {}, _a[name] = value, _a));
        setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: updatedVariants })); });
    };
    var handleAddVariant = function () {
        var newVariant = {
            name: campaignData.type ? "".concat(campaignData.type.charAt(0).toUpperCase() + campaignData.type.slice(1), " ").concat(String.fromCharCode(65 + variantCount)) : "Alternative Element ".concat(String.fromCharCode(65 + variantCount)),
            identifier: '',
        };
        setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: __spreadArray(__spreadArray([], prevData.variants, true), [newVariant], false) })); });
        setVariantCount(variantCount + 1);
    };
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCampaignData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    updatedCampaignData = __assign(__assign({}, campaignData), { control_name: 'Original', variants: campaignData.variants.map(function (variant, index) { return (__assign(__assign({}, variant), { name: "Variant ".concat(String.fromCharCode(65 + index)) })); }) });
                    return [4 /*yield*/, ABTestService.createCampaign(updatedCampaignData)];
                case 2:
                    _a.sent();
                    props.setCurrentTab('success');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    props.setCurrentTab('error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Container, { maxWidth: "sm" },
        React.createElement(FormContainer, { noValidate: true, autoComplete: "off", onSubmit: handleSubmit },
            React.createElement(Box, { mb: 3 },
                React.createElement(Typography, { variant: "h6", component: "h2" }, "Set Up A New Campaign"),
                React.createElement(LineInput, { id: "campaign_name", label: "Campaign Name", name: "campaign_name", value: campaignData.campaign_name, onChange: handleInputChange, variant: "outlined", fullWidth: true }),
                React.createElement(LineInput, { id: "type", select: true, label: "Campaign Type", name: "type", value: campaignData.type, onChange: handleInputChange, SelectProps: { native: true }, variant: "outlined", fullWidth: true, InputLabelProps: { shrink: true } },
                    React.createElement("option", { value: "" }, "Select"),
                    React.createElement("option", { value: "headline" }, "Headline"),
                    React.createElement("option", { value: "image" }, "Image Src"),
                    React.createElement("option", { value: "custom" }, "Custom")),
                React.createElement(LineInput, { id: "control_identifier", label: campaignData.type === 'headline' ? "Original Headline" : campaignData.type === 'image' ? "Original Image Src" : campaignData.type === 'custom' ? "Original Custom" : "Orignal Element", name: "control_identifier", value: campaignData.control_identifier, onChange: handleInputChange, variant: "outlined", fullWidth: true, required: true }),
                React.createElement(Typography, { variant: "h6", component: "h2", sx: { mt: 2 } },
                    campaignData.type === 'headline' ? "Add Headlines" : campaignData.type === 'image' ? "Add Image Sources" : campaignData.type === 'custom' ? "Add Custom Element" : "",
                    "          "),
                campaignData.variants.map(function (variant, variantIndex) { return (React.createElement(Box, { key: variantIndex, mb: 3 },
                    React.createElement(VariantName, { variant: "body1" }, variant.name),
                    React.createElement(LineInput, { id: "variant-identifier-".concat(variantIndex), label: campaignData.type === 'headline' ? "Alternative Headline" : campaignData.type === 'image' ? "Alternative Image Src" : "Alternative element", name: "identifier", value: variant.identifier, onChange: function (event) {
                            return handleVariantChange(event, variantIndex);
                        }, variant: "outlined", fullWidth: true, required: true }),
                    React.createElement(Delete, { style: { color: 'red', cursor: 'pointer', marginTop: '16px' }, onClick: function () { return handleRemoveVariant(variantIndex); } }))); }),
                React.createElement(Button, { variant: "outlined", color: "primary", onClick: handleAddVariant, sx: { mt: 2 } }, "Add Variant")),
            React.createElement(Button, { variant: "contained", color: "primary", type: "submit" }, "Create Test"))));
};
export default CreateCampaign;
