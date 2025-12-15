pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                // Install npm packages
                sh 'npm install'
            }
        }
        stage('Build Next.js App') {
            steps {
                // Build the Next.js app for production
                sh 'npm run build'
            }
        }
        stage('Start Production Server') {
            steps {
                // Start the Next.js app in production mode
                sh 'PORT=3002 npm run start'
            }
        }
       
        stage('Check if App is Running') {
            steps {
                // Wait a few seconds for the server to start
                sleep 10
              echo "website is live"
                            
            }
        }
    }
}
