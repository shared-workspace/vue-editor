#!/bin/bash

# Function to check if Firefox is installed
check_firefox_installed() {
    if command -v firefox &> /dev/null || command -v firefox-esr &> /dev/null; then
        return 0
    else
        echo "Firefox not found"
        return 1
    fi
}

# Function to start Firefox in kiosk mode with a temporary profile
start_firefox() {
    # Check if DISPLAY is set, if not, set it
    if [ -z "$DISPLAY" ]; then
        export DISPLAY=:1
    fi
    
    # Create a temporary profile
    firefox -CreateProfile "TempProfile" &> /dev/null
    
    # Open Firefox in full screen to localhost:3000 with the temporary profile
    if command -v firefox &> /dev/null; then
        firefox -P "TempProfile" -kiosk http://localhost:3000 &> /dev/null &
        echo "Firefox started in kiosk mode."
    elif command -v firefox-esr &> /dev/null; then
        firefox-esr -P "TempProfile" -kiosk http://localhost:3000 &> /dev/null &
        echo "Firefox ESR started in kiosk mode."
    fi
}

# Function to close Firefox processes
stop_firefox() {
    # Find all running Firefox processes
    pids=$(pgrep -f firefox)
    
    if [ -z "$pids" ]; then
        echo "No Firefox process found."
    else
        echo "Sending SIGTERM to Firefox..."
        # Terminate Firefox processes with SIGTERM
        kill -15 $pids
        
        # Wait for processes to terminate
        sleep 5
        
        # Check if any Firefox processes are still running
        pids=$(pgrep -f firefox)
        if [ -n "$pids" ]; then
            echo "Some Firefox processes did not terminate. Forcing shutdown..."
            kill -9 $pids
        else
            echo "Firefox has been closed."
        fi
        
        # Delete the temporary profile
        rm -rf ~/.mozilla/firefox/*.default-release/ # Adjust path if necessary
        echo "Temporary profile deleted."
    fi
}

# Check if Firefox is installed
if ! check_firefox_installed; then
    exit 1
fi

# Check the argument passed to the script
case "$1" in
    start)
        start_firefox
        ;;
    stop)
        stop_firefox
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
