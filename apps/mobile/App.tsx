import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';

export default function WorkerApp() {
  const [taskState, setTaskState] = useState<'IDLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'ON_SITE' | 'COMPLETED'>('ASSIGNED');
  
  const currentTask = {
    id: '#203',
    title: 'Medical Emergency - Attendee Collapsed',
    location: 'VIP Gate 2 Turnstiles',
    category: 'MEDICAL',
    priority: 'EMERGENCY'
  };

  const handleAccept = () => {
    setTaskState('IN_TRANSIT');
    Alert.alert("Task Accepted", "Status updated to ACCEPTED & IN_TRANSIT. Dispatch notified.");
  };

  const handleReject = () => {
    setTaskState('IDLE');
    Alert.alert("Task Rejected", "Task returned to AI Dispatch engine for auto-reassignment.");
  };

  const handleNavigate = () => {
    Alert.alert("Navigation Active", "Opening Google Maps turn-by-turn route to VIP Gate 2 Turnstiles.");
  };

  const handleDone = () => {
    setTaskState('COMPLETED');
    Alert.alert("Task Completed", "Task marked COMPLETED. Verification synced to Command Center.");
  };

  const handleSOS = () => {
    Alert.alert("🚨 EMERGENCY SOS BROADCAST 🚨", "Immediate SOS alert dispatched to Operations Command with live location pin!", [
      { text: "ACKNOWLEDGE", style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Status Telemetry */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>EventOS Worker Terminal</Text>
        <Text style={styles.telemetry}>Ravi Kumar (Doctor) • Battery 88% • 5G</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Assigned Task Banner */}
        {taskState !== 'IDLE' && taskState !== 'COMPLETED' ? (
          <View style={styles.taskCard}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>🔴 CRITICAL ASSIGNED TASK</Text>
            </View>
            <Text style={styles.taskTitle}>{currentTask.title}</Text>
            <Text style={styles.taskMeta}>📍 {currentTask.location}</Text>
            <Text style={styles.taskMeta}>🔧 Category: {currentTask.category}</Text>
            <Text style={styles.stateMeta}>Status: {taskState}</Text>
          </View>
        ) : (
          <View style={styles.idleCard}>
            <Text style={styles.idleText}>Available for AI Dispatch</Text>
          </View>
        )}

        {/* 5 CORE ACTION BUTTONS */}
        <View style={styles.buttonContainer}>
          {/* 1. ACCEPT */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnAccept]} 
            onPress={handleAccept}
            disabled={taskState === 'IN_TRANSIT'}
          >
            <Text style={styles.btnText}>1. ACCEPT</Text>
          </TouchableOpacity>

          {/* 2. REJECT */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnReject]} 
            onPress={handleReject}
          >
            <Text style={styles.btnText}>2. REJECT</Text>
          </TouchableOpacity>

          {/* 3. NAVIGATE */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnNavigate]} 
            onPress={handleNavigate}
          >
            <Text style={styles.btnText}>3. NAVIGATE</Text>
          </TouchableOpacity>

          {/* 4. DONE */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnDone]} 
            onPress={handleDone}
          >
            <Text style={styles.btnText}>4. DONE</Text>
          </TouchableOpacity>

          {/* 5. SOS */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnSOS]} 
            onPress={handleSOS}
          >
            <Text style={styles.btnSOSText}>5. 🚨 EMERGENCY SOS 🚨</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060911',
  },
  topBar: {
    padding: 16,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  appTitle: {
    color: '#38bdf8',
    fontWeight: '900',
    fontSize: 16,
  },
  telemetry: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
    marginBottom: 20,
  },
  priorityBadge: {
    backgroundColor: '#7f1d1d',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityText: {
    color: '#f87171',
    fontWeight: 'bold',
    fontSize: 12,
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskMeta: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  stateMeta: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 6,
  },
  idleCard: {
    padding: 24,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  idleText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 14,
  },
  btn: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  btnAccept: {
    backgroundColor: '#16a34a',
  },
  btnReject: {
    backgroundColor: '#475569',
  },
  btnNavigate: {
    backgroundColor: '#2563eb',
  },
  btnDone: {
    backgroundColor: '#0d9488',
  },
  btnSOS: {
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#fca5a5',
    paddingVertical: 22,
    marginTop: 10,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  btnSOSText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
});
