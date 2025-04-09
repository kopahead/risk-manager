// components/LoginModal.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModalWrapper from "@/components/ModalWrapper";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [tokenInput, setTokenInput] = useState("");

  const handleLogin = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("notionToken", tokenInput.trim());
      onLogin(tokenInput.trim());
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Login">
      <Input
        type="password"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        placeholder="Enter Notion token"
        className="mb-4"
      />
      <Button onClick={handleLogin} className="w-full">Login</Button>
    </ModalWrapper>
  );
}