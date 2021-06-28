// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { RandomHelper } from "./randomHelper.mjs";
/**
 * Generate a new random array.
 * @param length The length of buffer to create.
 * @returns The random array.
 */
RandomHelper.generate = (length) => {
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tSGVscGVyLWJyb3dzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvcmFuZG9tSGVscGVyLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUM7Ozs7R0FJRztBQUNILFlBQVksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUN2QyxNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMzQyxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDLENBQUMifQ==