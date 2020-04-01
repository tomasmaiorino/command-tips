pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'npm --version'
                dir("${env.WORKSPACE}/client"){
                    sh "pwd"
                    sh 'ls -altr'
                }
                dir("${env.WORKSPACE}/server"){
                    sh "pwd"
                    sh 'ls -altr'
                }
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