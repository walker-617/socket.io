import { io } from "socket.io-client";
import {serverURL} from "./variables.js";

const socket = io(serverURL);

export default socket;