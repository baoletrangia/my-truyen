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
