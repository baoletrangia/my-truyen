pipeline {
    agent any
    tools {
        nodejs 'node-lts-24'
    }
    stages {
        stage('Install') {
            steps {
                echo 'Installing...'
                sh 'node --version && npm --version'
                sh 'npm ci'
            }
        }
        stage('Build') {
            environment {
                NEXT_PUBLIC_SHEETS_ID = credentials('google-sheet-id')
                NEXT_PUBLIC_GOOGLE_CLIENT_ID = credentials('google-client-id')
                GOOGLE_API_KEY = credentials('google-sheet-api-key')
            }
            steps {
                echo 'Building..'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh 'npm run lint'
            }
        }
    }
}
