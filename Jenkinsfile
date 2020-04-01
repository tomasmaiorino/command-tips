pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'cd client'
                sh 'pwd'
                sh 'ls -altr'
                sh 'cd client'
                sh 'pwd'
                sh 'ls -altr'
                sh 'npm --version'
            }
        }
        /*
        stage('build-server') {
            steps {
                sh 'cd server'
                sh 'npm install'
            }
        }
        */
    }
}