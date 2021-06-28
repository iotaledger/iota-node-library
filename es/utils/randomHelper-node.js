// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { RandomHelper } from "./randomHelper";
/**
 * Generate a new random array.
 * @param length The length of buffer to create.
 * @returns The random array.
 */
RandomHelper.generate = (length) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const crypto = require("crypto");
    return crypto.randomBytes(length);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tSGVscGVyLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvcmFuZG9tSGVscGVyLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUM7Ozs7R0FJRztBQUNGLFlBQVksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUN4QyxvR0FBb0c7SUFDcEcsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQWUsQ0FBQztBQUNwRCxDQUFDLENBQUMifQ==