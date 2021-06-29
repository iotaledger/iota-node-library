/**
 * Class to help with units formatting.
 */
export class UnitsHelper {
    /**
     * Format the value in the best units.
     * @param value The value to format.
     * @param decimalPlaces The number of decimal places to display.
     * @returns The formated value.
     */
    static formatBest(value, decimalPlaces = 2) {
        return UnitsHelper.formatUnits(value, UnitsHelper.calculateBest(value), decimalPlaces);
    }
    /**
     * Format the value in the best units.
     * @param value The value to format.
     * @param unit The unit to format with.
     * @param decimalPlaces The number of decimal places to display.
     * @returns The formated value.
     */
    static formatUnits(value, unit, decimalPlaces = 2) {
        if (!UnitsHelper.UNIT_MAP[unit]) {
            throw new Error(`Unrecognized unit ${unit}`);
        }
        if (!value) {
            return `0 ${unit}`;
        }
        return unit === "i"
            ? `${value} i`
            : `${UnitsHelper.convertUnits(value, "i", unit).toFixed(decimalPlaces)} ${unit}`;
    }
    /**
     * Format the value in the best units.
     * @param value The value to format.
     * @returns The best units for the value.
     */
    static calculateBest(value) {
        let bestUnits = "i";
        if (!value) {
            return bestUnits;
        }
        const checkLength = Math.abs(value).toString().length;
        if (checkLength > UnitsHelper.UNIT_MAP.Pi.dp) {
            bestUnits = "Pi";
        }
        else if (checkLength > UnitsHelper.UNIT_MAP.Ti.dp) {
            bestUnits = "Ti";
        }
        else if (checkLength > UnitsHelper.UNIT_MAP.Gi.dp) {
            bestUnits = "Gi";
        }
        else if (checkLength > UnitsHelper.UNIT_MAP.Mi.dp) {
            bestUnits = "Mi";
        }
        else if (checkLength > UnitsHelper.UNIT_MAP.Ki.dp) {
            bestUnits = "Ki";
        }
        return bestUnits;
    }
    /**
     * Convert the value to different units.
     * @param value The value to convert.
     * @param fromUnit The form unit.
     * @param toUnit The to unit.
     * @returns The formatted unit.
     */
    static convertUnits(value, fromUnit, toUnit) {
        if (!value) {
            return 0;
        }
        if (!UnitsHelper.UNIT_MAP[fromUnit]) {
            throw new Error(`Unrecognized fromUnit ${fromUnit}`);
        }
        if (!UnitsHelper.UNIT_MAP[toUnit]) {
            throw new Error(`Unrecognized toUnit ${toUnit}`);
        }
        if (fromUnit === "i" && value % 1 !== 0) {
            throw new Error("If fromUnit is 'i' the value must be an integer value");
        }
        if (fromUnit === toUnit) {
            return Number(value);
        }
        const multiplier = value < 0 ? -1 : 1;
        const scaledValue = Math.abs(Number(value)) *
            UnitsHelper.UNIT_MAP[fromUnit].val /
            UnitsHelper.UNIT_MAP[toUnit].val;
        const numDecimals = UnitsHelper.UNIT_MAP[toUnit].dp;
        // We cant use toFixed to just convert the new value to a string with
        // fixed decimal places as it will round, which we don't want
        // instead we want to convert the value to a string and manually
        // truncate the number of digits after the decimal
        // Unfortunately large numbers end up in scientific notation with
        // the regular toString() so we use a custom conversion.
        let fixed = scaledValue.toString();
        if (fixed.includes("e")) {
            fixed = scaledValue.toFixed(Number.parseInt(fixed.split("-")[1], 10));
        }
        // Now we have the number as a full string we can split it into
        // whole and decimals parts
        const parts = fixed.split(".");
        if (parts.length === 1) {
            parts.push("0");
        }
        // Now truncate the decimals by the number allowed on the toUnit
        parts[1] = parts[1].slice(0, numDecimals);
        // Finally join the parts and convert back to a real number
        return Number.parseFloat(`${parts[0]}.${parts[1]}`) * multiplier;
    }
}
/**
 * Map units.
 */
UnitsHelper.UNIT_MAP = {
    i: { val: 1, dp: 0 },
    Ki: { val: 1000, dp: 3 },
    Mi: { val: 1000000, dp: 6 },
    Gi: { val: 1000000000, dp: 9 },
    Ti: { val: 1000000000000, dp: 12 },
    Pi: { val: 1000000000000000, dp: 15 }
};
