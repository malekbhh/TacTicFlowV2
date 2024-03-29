<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\MailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/{projectId}/tasks', [TaskController::class, 'getTasksByProjectId']);
    Route::post('/projects/{projectId}/tasks', [TaskController::class, 'createTask']);
    Route::post('/tasks/{taskId}/status', [TaskController::class, 'updateTaskStatus']);
    Route::delete('/tasks/{taskId}', [TaskController::class, 'deleteTask']);

    // Routes pour les projets
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{projectId}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    Route::get('/projects/{idOrProject}', [ProjectController::class, 'showProject']);
 
            Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user1', [UserController::class, 'getUser']);
    Route::post('/user/avatar', [UserController::class, 'updatePhoto']);

    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/usersAccount/{user}', [UserController::class, 'destroyUsers']);
    Route::get('/usersAccount', [UserController::class, 'indexUsers']);
    // Routes pour gérer les utilisateurs non autorisés
    Route::get('/UnauthorizedUsers', [UserController::class, 'showUnauth']);
    Route::post('/UnauthorizedUsers', [UserController::class, 'authorizeUnauthorizedUser']);
    Route::delete('/UnauthorizedUsers/{user}', [UserController::class, 'destroyUnauth']);
    Route::post('/users', [UserController::class, 'store']);


    // Route de déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes publiques (non authentifiées)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-with-google', [AuthController::class, 'handleGoogleCallback']);
Route::post('/password-reset', [AuthController::class, 'passwordReset']);
Route::post('/new-password', [AuthController::class, 'newPassword']);
Route::post('/send-email', [MailController::class, 'sendEmail']);
Route::post('/storeUnAuthUser', [UserController::class, 'storeUnAuthUser']);