pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'cd client'
                sh 'pwd'
                sh 'ls -altr'
                //sh 'cd client'
                //sh 'pwd'
                //sh 'ls -altr'
                //sh 'npm --version'
                dir('client'){
                    sh "pwd"
                    sh 'ls -altr'
                }
                dir("${env.WORKSPACE}/"){
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