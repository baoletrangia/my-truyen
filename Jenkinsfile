pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                npm run build
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                npm run lint
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
