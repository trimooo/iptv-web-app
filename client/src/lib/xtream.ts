import express, { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

// Define Xtream Account Type
interface XtreamAccount {
  host: string;
  username: string;
  password: string;
}

// File storage (modify to use a database)
const FILE_PATH = path.join(__dirname, "../data/xtream_accounts.json");

// Utility function to read stored accounts
const readXtreamAccounts = (): XtreamAccount[] => {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data || "[]");
};

// Utility function to write accounts
const writeXtreamAccounts = (accounts: XtreamAccount[]) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(accounts, null, 2));
};

// API to add Xtream Account
router.post("/api/xtream/add", async (req: Request, res: Response) => {
  const { host, username, password }: XtreamAccount = req.body;
  
  if (!host || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate Xtream credentials
  const xtreamUrl = `${host}/player_api.php?username=${username}&password=${password}`;

  try {
    const response = await axios.get(xtreamUrl, { timeout: 5000 });

    if (response.status !== 200) {
      return res.status(400).json({ error: "Invalid Xtream credentials" });
    }

    // Save the account
    const accounts = readXtreamAccounts();
    accounts.push({ host, username, password });
    writeXtreamAccounts(accounts);

    res.json({ message: "Xtream account added successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to connect to Xtream API" });
  }
});

// API to list Xtream Accounts
router.get("/api/xtream/accounts", (req: Request, res: Response) => {
  const accounts = readXtreamAccounts();
  res.json(accounts);
});

// API to delete an Xtream Account
router.delete("/api/xtream/delete/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  let accounts = readXtreamAccounts();
  accounts = accounts.filter(account => account.username !== username);
  writeXtreamAccounts(accounts);
  res.json({ message: "Xtream account deleted successfully" });
});

export default router;
