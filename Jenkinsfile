pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                sh 'cd client'
                sh 'npm install'
            }
        }
        stage('build-server') {
            steps {
                sh 'cd server'
                sh 'npm install'
            }
        }
    }
}