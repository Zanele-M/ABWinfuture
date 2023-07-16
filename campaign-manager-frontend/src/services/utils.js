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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var handleInputChange = function (event, setData) {
    var _a = event.target, name = _a.name, value = _a.value;
    setData(function (prevData) {
        var _a;
        return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
    });
};
export var handleVariantChange = function (event, index, campaignData, setCampaignData) {
    var _a;
    var _b = event.target, name = _b.name, value = _b.value;
    var updatedVariants = __spreadArray([], campaignData.variants, true);
    updatedVariants[index] = __assign(__assign({}, updatedVariants[index]), (_a = {}, _a[name] = value, _a));
    setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: updatedVariants })); });
};
export var handleAddVariant = function (setCampaignData, variantName) {
    var newVariant = {
        name: variantName,
        identifier: '',
    };
    setCampaignData(function (prevData) { return (__assign(__assign({}, prevData), { variants: __spreadArray(__spreadArray([], prevData.variants, true), [newVariant], false) })); });
};
