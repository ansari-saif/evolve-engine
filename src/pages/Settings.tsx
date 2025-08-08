import { motion } from "framer-motion";
import { Settings as SettingsIcon, User } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Customize your startup journey experience</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border/50"
      >
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold">Coming Soon</h2>
        </div>
        <p className="text-text-secondary">
          Profile management, notification preferences, and AI coaching customization.
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;