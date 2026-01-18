import { test, expect } from "vitest";
import { ConnectionState } from "../connection-state";

test("初期状態はdisconnected", () => {
  const state = ConnectionState.initial();
  expect(state).toBe("disconnected");
});

test("disconnectedからconnectingに遷移できる", () => {
  const canTransition = ConnectionState.canTransition(
    "disconnected",
    "connecting",
  );
  expect(canTransition).toBe(true);
});

test("connectingからconnectedに遷移できる", () => {
  const canTransition = ConnectionState.canTransition(
    "connecting",
    "connected",
  );
  expect(canTransition).toBe(true);
});

test("connectingからerrorに遷移できる", () => {
  const canTransition = ConnectionState.canTransition("connecting", "error");
  expect(canTransition).toBe(true);
});

test("connectedからdisconnectedに遷移できる", () => {
  const canTransition = ConnectionState.canTransition(
    "connected",
    "disconnected",
  );
  expect(canTransition).toBe(true);
});

test("connectedからreconnectingに遷移できる", () => {
  const canTransition = ConnectionState.canTransition(
    "connected",
    "reconnecting",
  );
  expect(canTransition).toBe(true);
});

test("reconnectingからconnectedに遷移できる", () => {
  const canTransition = ConnectionState.canTransition(
    "reconnecting",
    "connected",
  );
  expect(canTransition).toBe(true);
});

test("reconnectingからerrorに遷移できる", () => {
  const canTransition = ConnectionState.canTransition("reconnecting", "error");
  expect(canTransition).toBe(true);
});

test("errorからdisconnectedに遷移できる", () => {
  const canTransition = ConnectionState.canTransition("error", "disconnected");
  expect(canTransition).toBe(true);
});

test("disconnectedからconnectedに直接遷移できない", () => {
  const canTransition = ConnectionState.canTransition(
    "disconnected",
    "connected",
  );
  expect(canTransition).toBe(false);
});

test("connectedかどうかを判定できる", () => {
  expect(ConnectionState.isConnected("connected")).toBe(true);
  expect(ConnectionState.isConnected("disconnected")).toBe(false);
  expect(ConnectionState.isConnected("connecting")).toBe(false);
});

test("接続中かどうかを判定できる", () => {
  expect(ConnectionState.isConnecting("connecting")).toBe(true);
  expect(ConnectionState.isConnecting("reconnecting")).toBe(true);
  expect(ConnectionState.isConnecting("connected")).toBe(false);
});

test("切断状態かどうかを判定できる", () => {
  expect(ConnectionState.isDisconnected("disconnected")).toBe(true);
  expect(ConnectionState.isDisconnected("connected")).toBe(false);
});

test("エラー状態かどうかを判定できる", () => {
  expect(ConnectionState.isError("error")).toBe(true);
  expect(ConnectionState.isError("connected")).toBe(false);
});
