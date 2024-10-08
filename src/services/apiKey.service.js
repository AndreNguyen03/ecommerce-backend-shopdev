"use strict";

import apikeyModel from "../models/apikey.model.js";
import crypto from "crypto";
const findById = async (key) => {
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

export { findById };
