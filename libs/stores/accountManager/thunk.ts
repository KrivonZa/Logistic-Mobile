import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAccount } from "@/libs/services/manageAccount";

export const updateAccount = createAsyncThunk(
  "account/update",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await manageAccount.updateAccount(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Không thành công.");
    }
  }
);
